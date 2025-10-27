import type { Icon, IconProps } from "@tabler/icons-react";

type Props = {
  icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>,
  color: string,
  title: string,
  count: number | string
}

export default function AdminCard({icon, color, title, count}:Props) {
  const Icon = icon;
  return (
    <div className="p-6 bg-card rounded-md bg-slate-800 border border-slate-600">
      <div className="flex items-center gap-3 mb-2">
        <div className={`rounded-full p-1.5 ${color === '#8e51ff' ? "bg-violet-500/20" : "bg-cyan-500/10"}`}>
          <Icon color={color} />
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-3xl font-bold text-foreground">{count}</p>
    </div>
  );
}
