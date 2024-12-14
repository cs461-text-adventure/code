export default function ErrorComponent(props: { message: string }) {
  return (
    <div className="flex mb-4 w-full text-center">
      <label className="p-4 w-full bg-red-600/25 text-red-700 dark:text-red-500 border border-red-600 rounded-lg text-sm">
        {props.message}
      </label>
    </div>
  );
}
