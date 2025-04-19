import { SideForm } from "@/components/ext/side-form";

export default () => {
  return (
    <SideForm sideImage={<></>}>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Login</h1>
        </div>
        {/* {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )} */}
        
      </div>
    </SideForm>
  );
};
