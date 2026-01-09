import DOMPurify from "dompurify";
import type { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  content: string;
}

const SecureContent = ({ content, ...props }: Props) => {
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} {...props} />
  );
};

export default SecureContent;
