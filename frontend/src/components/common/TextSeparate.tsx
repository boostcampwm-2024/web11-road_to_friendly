interface TextSeparateProps {
  text: string;
  separator?: string;
}

const TextSeparate = ({ text, separator = '\n' }: TextSeparateProps) => {
  const descriptionList = text.split(separator);
  return (
    <>
      {descriptionList.map((des, idx) => {
        return <p key={idx}>{des.trim()}</p>;
      })}
    </>
  );
};

export default TextSeparate;
