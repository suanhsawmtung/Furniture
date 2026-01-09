import LogoIcon from "@/components/icons/logo-icon";
import { siteConfig } from "@/config/site";
import { Link } from "react-router";
import ContentWrapper from "../../wrapper/content-wrapper";
import NewsLetterForm from "./news-letter-form";

const Footer = () => {
  return (
    <footer className="w-full border-t">
      <ContentWrapper className="pt-8 pb-14">
        <div className="flex flex-col items-start justify-start gap-x-16 gap-y-12 xl:flex-row">
          <Link to="/">
            <div className="flex items-center gap-x-2">
              <LogoIcon className="text-primary size-8" aria-hidden={true} />
              <h1 className="text-xl font-semibold">{siteConfig.name}</h1>
              <span className="sr-only">Home</span>
            </div>
          </Link>

          <div className="grid w-full grid-cols-2 gap-14 lg:w-auto lg:grid-cols-4">
            {siteConfig.footerNav.map((data) => (
              <div key={data.title} className="space-y-4">
                <h2 className="text-base font-semibold">{data.title}</h2>
                <ul className="flex flex-col items-start justify-start gap-y-2">
                  {data.items.map((item) => (
                    <li
                      key={item.title}
                      className="text-muted-foreground hover:text-accent-foreground text-base"
                    >
                      <Link
                        to={item.href || "/"}
                        target={item.external ? "_blank" : undefined}
                      >
                        {item.title}
                        <span className="sr-only">{item.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex w-full flex-1 items-start justify-start xl:w-auto xl:justify-center">
            <NewsLetterForm />
          </div>
        </div>
      </ContentWrapper>
    </footer>
  );
};

export default Footer;
