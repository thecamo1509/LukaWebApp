import { auth, signOut } from "@/auth";
import styles from "./layout.module.css";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>Dashboard</h1>
          <div className={styles.userSection}>
            {session?.user?.name && (
              <span className={styles.userName}>
                Hello, {session.user.name}
              </span>
            )}
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/onboarding" });
              }}
            >
              <button type="submit" className={styles.signOutButton}>
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
