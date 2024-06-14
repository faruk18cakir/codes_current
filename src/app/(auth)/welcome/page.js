import Link from "next/link";

export default function Welcome() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-neutral-focus">
      <div className="card shadow-xl w-96 bg-base-100">
        <div className="card-body p-6">
          <h1 className="text-3xl text-center font-bold mb-2">Hoş Geldin!</h1>
          <div className="flex flex-col gap-4">
            <Link href="/login-company" className="btn btn-primary w-full">
              Şirket Girişi
            </Link>
            <Link href="/login" className="btn btn-primary w-full">
              Stajyer Girişi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
