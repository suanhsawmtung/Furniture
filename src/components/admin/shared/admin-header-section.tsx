import AuthDropdown from "@/components/layouts/header/auth-dropdown";
import { ModeToggle } from "@/components/layouts/header/mode-toggle";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";

export const AdminHeaderActions = ({ className }: { className?: string }) => {
  const authUser = useAuthStore((state) => state.authUser);

  return (
    <div className={cn("font-medium", className)}>
      <ModeToggle />
      {/* <p className="text-secondary font-medium text-sm">Walking Brands</p> */}
      <AuthDropdown user={authUser} />
    </div>
  );
};

const AdminHeaderSection = ({ title }: { title: string }) => {
  return (
    <div className="mb-[60px] flex w-full items-center justify-between">
      <h1 className="text-primary text-xl font-bold md:text-3xl">{title}</h1>
      <div className="flex items-center gap-x-6">
        {/* <div className="w-10 h-10 rounded-full bg-white relative  flex justify-center items-center">
          <Bell size={20} color={"#202020"} />
          <div className="w-2 h-2 rounded-full bg-primary absolute top-0 right-1" />
        </div> */}
        <AdminHeaderActions className="hidden items-center gap-x-3 md:flex" />
      </div>
    </div>
  );
};

export default AdminHeaderSection;
