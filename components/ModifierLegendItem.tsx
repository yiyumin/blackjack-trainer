type ModifierLegendItemProps = {
  children: React.ReactNode;
  description: string;
};

const ModifierLegendItem = ({
  children,
  description,
}: ModifierLegendItemProps) => {
  return (
    <div className='flex items-center gap-2'>
      <div>{children}</div>
      <div className='text-xs'>{description}</div>
    </div>
  );
};

export default ModifierLegendItem;
