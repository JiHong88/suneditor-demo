export type Method = {
  name: string;
  params: string;
  returns: string;
  description: string;
  example?: string;
  paramDescriptions?: Record<string, string>;
  returnsDescription?: string;
};

export type Subgroup = {
  title: string;
  description?: string;
  methods: Method[];
  type?: string;
};

export type Group = {
  title: string;
  description: string;
  methods: Method[];
  subgroups?: { [key: string]: Subgroup };
};

export type TypeDefinition = {
  name: string;
  definition: string;
  kind: "type" | "interface";
  source: string;
  memberDescriptions?: Record<string, string>;
};

export type TypesGroup = {
  title: string;
  description: string;
  items: TypeDefinition[];
};

export type ApiDocs = {
  version: string;
  generatedAt: string;
  structure: {
    editor: Group;
    plugins: Group;
    modules: Group;
    helpers: Group;
    events: Group;
    hooks: Group;
    interfaces: Group;
    types: TypesGroup;
    [key: string]: Group | TypesGroup;
  };
};

export type SidebarItem = {
  id: string;
  title: string;
  count: number;
  type?: "group" | "subgroup" | "separator";
  variant?: "typeish";
  children?: SidebarItem[];
};

export type ContentData = {
  title: string;
  description?: string;
  methods: Method[];
  prefix: string;
};
