export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  age: number | null;
}

export interface StudentInput {
  firstName: string;
  lastName: string;
  age?: number | null;
}
