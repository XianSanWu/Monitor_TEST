export interface MenuItem {
  path: string | undefined;
  title: string | undefined;
  icon: string | undefined;
  children?: MenuItem[];
}
