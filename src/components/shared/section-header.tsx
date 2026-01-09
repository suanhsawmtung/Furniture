import { Link } from "react-router";

interface Props {
  title: string;
  link?: {
    text: string;
    href: string;
  };
}

const SectionHeader = ({ title, link }: Props) => {
  return (
    <div className="flex w-full flex-col items-start justify-between gap-y-2 md:flex-row md:items-center">
      <h3 className="text-2xl font-bold">{title}</h3>
      {link && (
        <Link to={link.href}>
          <p className="text-muted-foreground text-base font-semibold underline">
            {link.text}
          </p>
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;
