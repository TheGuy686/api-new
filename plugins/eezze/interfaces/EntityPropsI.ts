export interface EntityPropI {
   name: string;
   type: string;
   isEntity: boolean;
   isTransient: boolean;
   defaultValue: any;
   relationType?: { code: string, name: string };
}

export interface EntityPropsI {
   [prop: string]: EntityPropI
}