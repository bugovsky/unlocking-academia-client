export type FunctionComponent = React.ReactElement | null;

type HeroIconSVGProps = React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> &
  React.RefAttributes<SVGSVGElement>;
type IconProps = HeroIconSVGProps & {
  title?: string;
  titleId?: string;
};
export type Heroicon = React.FC<IconProps>;

export enum Role {
  STUDENT = "student",
  EXPERT = "expert",
  ADMIN = "admin",
}

export enum Domain {
  MATHEMATICS = "Математические науки",
  CS = "Компьютерные науки",
  DB = "Базы данных",
}

export enum RequestType {
  QUESTION = "question",
  CONSULTATION = "consultation",
}

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: Role;
  domain?: Domain[];
}

export interface Post {
  id: string;
  content: string;
  media_urls?: string[];
  domain: Domain[];
  views: number;
  rating?: number;
}

export interface Comment {
  id: string;
  content: string;
  author_id: string;
  post_id: string;
  firstname?: string;
  lastname?: string;
  role?: string;
}
export interface Rating {
  id: string;
  grade: number;
  post_id: string;
}

export interface Request {
  id: string;
  question: string;
  type: RequestType;
  response?: string;
  author_id?: string;
  recipient_id: string;
}