import { PasswordForm } from "@/components/shared/setting/password-form";
import { ProfileForm } from "@/components/shared/setting/profile-form";
import SectionHeader from "@/components/shared/section-header";
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
      <SectionHeader title="Settings" />

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
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Ensure your account is using a long, random password to stay
              secure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
