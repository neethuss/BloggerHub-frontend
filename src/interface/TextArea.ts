export interface TextareaProps {
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  cols?: number;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
  required?: boolean;
}