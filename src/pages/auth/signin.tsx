import { GetServerSideProps } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { BuiltInProviderType } from "next-auth/providers";
import {
  ClientSafeProvider,
  getCsrfToken,
  getProviders,
  LiteralUnion,
  signIn,
} from "next-auth/react";
import { authOptions } from "../api/auth/[...nextauth]";
import SimpleLogo from "../../components/SimpleLogo";

type SigninProps = {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  >;
  csrfToken: string;
};

const SigninPage: React.FC<SigninProps> = ({ providers, csrfToken }) => {
  return (
    <section className="h-screen">
      <div className="container h-full px-6 py-12">
        <div className="g-6 flex h-full flex-wrap items-center justify-center text-gray-800">
          <div className="mb-12 hidden md:mb-0 md:w-8/12 lg:block lg:w-6/12">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
              className="w-full"
              alt="Phone image"
            />
          </div>
          <div className="flex flex-col items-stretch md:w-8/12 lg:ml-20 lg:w-5/12">
            <img
              src="/travl-logo-dark.png"
              className="-mt-20 h-auto w-full md:self-center"
            />
            <h1 className="mb-8 text-4xl font-bold">Sign in with</h1>
            <div className="flex flex-col space-y-2">
              {providers &&
                Object.values(providers).map(provider => (
                  <button
                    key={provider.id}
                    className={`btn ${
                      provider.name === "Discord"
                        ? "btn-primary"
                        : "btn-secondary"
                    } gap-2`}
                    onClick={() =>
                      signIn(provider.id, {
                        callbackUrl: "/",
                      })
                    }
                  >
                    <SimpleLogo
                      name={provider.name.toLowerCase()}
                      size={20}
                      title={provider.name}
                    />
                    {provider.name}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SigninPage;

export const getServerSideProps: GetServerSideProps = async ctx => {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(ctx);
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      providers,
      csrfToken,
    },
  };
};
