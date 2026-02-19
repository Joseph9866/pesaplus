# Django KYC Permissions Fix

## Problem
Getting "You do not have permission to perform this action" (403 Forbidden) when submitting KYC.

## Root Cause
The Django backend is rejecting KYC creation requests because the authenticated user doesn't have the required permissions.

## Solutions

### Solution 1: Update KYC ViewSet Permissions

**File**: `accounts/views.py` (or wherever your KYC ViewSet is defined)

```python
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import KYC
from .serializers import KYCSerializer

class KYCViewSet(viewsets.ModelViewSet):
    """
    ViewSet for KYC operations
    """
    serializer_class = KYCSerializer
    permission_classes = [IsAuthenticated]  # ✅ Allow any authenticated user
    
    def get_queryset(self):
        # Users can only see their own KYC records
        return KYC.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # Automatically set the user to the current authenticated user
        serializer.save(user=self.request.user)
```

### Solution 2: Check Custom Permissions

If you're using custom permissions, make sure they allow POST requests:

**File**: `accounts/permissions.py`

```python
from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners to edit/delete their KYC
    """
    
    def has_permission(self, request, view):
        # Allow POST (create) for any authenticated user
        if request.method == 'POST':
            return request.user and request.user.is_authenticated
        
        # Allow GET, HEAD, OPTIONS for authenticated users
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        
        return True
    
    def has_object_permission(self, request, view, obj):
        # Read permissions for any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions only for the owner
        return obj.user == request.user
```

Then use it in your ViewSet:

```python
from .permissions import IsOwnerOrReadOnly

class KYCViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    # ... rest of code
```

### Solution 3: Check Django REST Framework Settings

**File**: `settings.py`

```python
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        # ❌ DON'T use this (too restrictive):
        # 'rest_framework.permissions.IsAdminUser',
        
        # ✅ USE this instead:
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
}
```

### Solution 4: Check User Role/Permissions

If your backend uses role-based permissions:

**Option A - Check in Django Admin:**
1. Go to Django admin: `http://localhost:8000/admin/`
2. Find your user account
3. Check:
   - Is Active: ✅ (must be checked)
   - Staff status: Not required for regular users
   - Groups: Check if user needs to be in a specific group
   - User permissions: Check if specific permissions are required

**Option B - Check in Django Shell:**
```bash
python manage.py shell
```

```python
from django.contrib.auth import get_user_model
User = get_user_model()

# Get your user
user = User.objects.get(email='your-email@example.com')

# Check user details
print(f"Is Active: {user.is_active}")
print(f"Is Staff: {user.is_staff}")
print(f"Groups: {list(user.groups.all())}")
print(f"Permissions: {list(user.user_permissions.all())}")

# If you have a role field
if hasattr(user, 'role'):
    print(f"Role: {user.role}")
```

**Option C - Add User to Required Group:**
```python
from django.contrib.auth.models import Group

# Create or get the customer group
customer_group, created = Group.objects.get_or_create(name='customer')

# Add user to group
user.groups.add(customer_group)
user.save()
```

### Solution 5: Check KYC Model Permissions

Make sure your KYC model doesn't have restrictive Meta permissions:

**File**: `accounts/models.py`

```python
class KYC(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # ... other fields
    
    class Meta:
        # ✅ Good - default permissions
        default_permissions = ('add', 'change', 'delete', 'view')
        
        # ❌ Bad - if you have custom permissions that are too restrictive
        # permissions = [
        #     ("can_approve_kyc", "Can approve KYC"),
        # ]
```

### Solution 6: Check URL Routing

Make sure your URL routing is correct:

**File**: `accounts/urls.py`

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import KYCViewSet

router = DefaultRouter()
router.register(r'kyc', KYCViewSet, basename='kyc')

urlpatterns = [
    path('api/', include(router.urls)),
]
```

## Testing the Fix

After making changes, test with curl:

```bash
# Get your access token first
TOKEN="your-access-token-here"

# Test KYC creation
curl -X POST http://localhost:8000/api/v1/accounts/api/kyc/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_number": "12345678",
    "kra_pin": "A123456789Z",
    "gender": "male",
    "marital_status": "single",
    "country": "Kenya",
    "county": "Nairobi",
    "kyc_submitted": true,
    "kyc_confirmed": false
  }'
```

Expected response:
- ✅ Status 201 Created = Success
- ❌ Status 403 Forbidden = Still has permission issues
- ❌ Status 401 Unauthorized = Token issue

## Quick Debug Commands

```bash
# Check Django logs
python manage.py runserver

# Check user permissions in shell
python manage.py shell
>>> from django.contrib.auth import get_user_model
>>> User = get_user_model()
>>> user = User.objects.get(email='your-email@example.com')
>>> user.has_perm('accounts.add_kyc')  # Should return True

# Create superuser if needed
python manage.py createsuperuser
```

## Most Common Fix

**99% of the time, this is the issue:**

```python
# In your KYCViewSet
class KYCViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]  # ← Add this line
    queryset = KYC.objects.all()
    serializer_class = KYCSerializer
    
    def get_queryset(self):
        # Filter to only show user's own records
        return self.queryset.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # Auto-assign the current user
        serializer.save(user=self.request.user)
```

This allows any authenticated user to create their own KYC record.
