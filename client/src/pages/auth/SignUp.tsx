import SignUpForm from "@/components/auth/signup-form";
import { Link } from "react-router-dom";

const SignUpPage = () => {
  return (
    <main className="container mx-auto my-auto min-h-screen ">
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-2 w-xs md:w-md sm:w-md py-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-center">
              Create an account
            </h1>
            <p className="text-base text-center">
              Enter your information to create an account
            </p>
          </div>
          <SignUpForm />
          <p className="text-muted-foreground text-base">
            Already have an account?{" "}
            <Link to="/signin" className="hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default SignUpPage;
