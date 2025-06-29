import SignInForm from "@/components/auth/signin-form";
import { Link } from "react-router-dom";

const SignInPage = () => {
  return (
    <main className="container mx-auto my-auto min-h-screen ">
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-2 w-xs md:w-md sm:w-md py-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-center">Welcome back</h1>
            <p className="text-base text-center">
              Enter your credentials to sign in to your account
            </p>
          </div>
          <SignInForm />
          <p className="text-muted-foreground text-base">
            Don't have an account?{" "}
            <Link to="/signup" className="hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default SignInPage;
