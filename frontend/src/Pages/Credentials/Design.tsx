function Design() {
  return (
    <div className="bg-slate-100 w-full h-full max-md:hidden relative">
      <div className="shadow-lg bg-purple-600 w-48 aspect-square rounded-full absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 " />
      <div className="backdrop-blur-md backdrop-opacity-100 absolute h-1/2 w-full left-0 bottom-0 bg-transparent" />
    </div>
  );
}

export default Design;
