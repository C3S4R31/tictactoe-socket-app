import { IconCircle, IconX  } from "@tabler/icons-react";

interface Props {
  index: number;
  cell: string | null;
  handleClick: (index: number) => void;
}
export default function BoardCell({ index, cell, handleClick }: Props) {
  return (
    <div
      onClick={() => handleClick(index)}
      className="shadow-md shadow-black/50 w-36 h-36 rounded-xl bg-slate-800  flex items-center justify-center hover:bg-slate-700 transition"
    >
      {cell === null ? '' : cell === 'X' ? (<IconX color="#00b8db" size={56} stroke={3} />):(<IconCircle color="#8e51ff" size={56} stroke={3} />)}
    </div>
  );
}
