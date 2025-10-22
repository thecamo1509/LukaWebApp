import { signIn } from "@/auth";

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <button className="bg-blue-500 text-white p-2 rounded-md" type="submit">
        Signin with Google
      </button>
    </form>
  );
}
