import AdminHeaderSection from "@/components/admin/shared/admin-header-section";
import { ChangePasswordForm } from "@/components/shared/setting/change-password-form";
import { ProfileForm } from "@/components/shared/setting/profile-form";
import { SetPasswordForm } from "@/components/shared/setting/set-password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetMe } from "@/services/setting/queries/useGetMe";

const AdminSettingsPage = () => {
  const { data: user, isLoading } = useGetMe();

  if (isLoading || !user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <AdminHeaderSection title="Settings" />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your account's profile information and profile picture.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm user={user} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              { 
                user?.hasPassword 
                  ? "Change Password" 
                  : "Set Password" 
              }
            </CardTitle>
            <CardDescription>
              Ensure your account is using a long, random password to stay
              secure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            { 
              user?.hasPassword 
                ? <ChangePasswordForm />
                : <SetPasswordForm /> 
            }
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
