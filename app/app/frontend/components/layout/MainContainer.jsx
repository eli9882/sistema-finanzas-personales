export default function MainContainer({ children, max = false }) {
  return (
    <section
      className={
        "flex-1 overflow-y-auto py-8 px-6 " +
        (max ? "max-w-4xl mx-auto" : "w-full")
      }
    >
      {children}
    </section>
  );
}