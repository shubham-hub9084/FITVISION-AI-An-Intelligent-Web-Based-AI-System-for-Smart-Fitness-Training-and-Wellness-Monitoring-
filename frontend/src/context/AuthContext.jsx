import React, { createContext, useContext } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { user: clerkUser, isLoaded, isSignedIn } = useUser();
    const { signOut, openSignIn, openSignUp } = useClerk();

    // Derived user object to match existing app structure
    // We map Clerk's user object to the shape expected by the frontend components
    const user = isSignedIn && clerkUser ? {
        id: clerkUser.id,
        full_name: clerkUser.fullName,
        email: clerkUser.primaryEmailAddress?.emailAddress,
        username: clerkUser.username || clerkUser.firstName,
        imageUrl: clerkUser.imageUrl, // Keep original for reference
        profileImage: clerkUser.imageUrl || clerkUser.profileImageUrl || clerkUser.avatarUrl,
        hasImage: clerkUser.hasImage,
        // Access custom metadata for app-specific fields
        weight: clerkUser.unsafeMetadata?.weight,
        height: clerkUser.unsafeMetadata?.height,
        goal: clerkUser.unsafeMetadata?.goal,
        // Include raw clerk user for advanced usage if needed
        clerkUser: clerkUser
    } : null;

    const loading = !isLoaded;

    const logout = async () => {
        await signOut();
    };

    // Replace custom login with Clerk's modal opener
    const login = () => {
        openSignIn();
    };

    // Update profile using Clerk's unsafeMetadata
    const updateProfile = async (profileData) => {
        if (!clerkUser) return false;
        try {
            await clerkUser.update({
                unsafeMetadata: {
                    ...clerkUser.unsafeMetadata,
                    ...profileData
                }
            });
            return true;
        } catch (error) {
            console.error("Failed to update profile", error);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, updateProfile, openSignUp }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
