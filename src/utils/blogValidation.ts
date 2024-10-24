const validateTitle = (title: string) => {
  return title.trim() ? "" : "Title is required";
};

const validateContent = (content: string) => {
  return content.trim() ? "" : "Content is required"; 
};

const validateImage = (image: File | null, isEdit: boolean) => {
  return isEdit ? "" : (image ? "" : "Image is required");
};

export const validateBlog = (
  title: string,
  content: string,
  image: File | null,
  isEdit: boolean = false 
) => {
  const isAnyFieldEmpty = !title || !content || (!image && !isEdit);

  if (isAnyFieldEmpty) {
    return {
      errors: { title: "", content: "", image: "" }, 
      isValid: false,
      isAnyFieldEmpty,
    };
  }

  const errors = {
    title: validateTitle(title),
    content: validateContent(content),
    image: validateImage(image, isEdit), 
  };

  const isValid = !errors.title && !errors.content && !errors.image;
  return { errors, isValid, isAnyFieldEmpty };
};
