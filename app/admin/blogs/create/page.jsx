import BlogForm from "../components/BlogForm";

export const metadata = {
  title: "Create Blog | Admin",
};

export default function CreateBlogPage() {
  return (
    <div>
      <BlogForm isEdit={false} />
    </div>
  );
}
