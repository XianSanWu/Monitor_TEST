export interface MenuItem {
  title: string;
  icon: string;
  link?: string;
  bitValue: number;
  children?: MenuItem[];
}
