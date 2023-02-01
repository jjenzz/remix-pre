import { Suspense } from "react";
import { defer } from "@remix-run/node";
import { useLoaderData, Await } from "@remix-run/react";

const ANIMALS = [
  { type: "cat", speak: "miaow" },
  { type: "dog", speak: "bark" },
  { type: "duck", speak: "quack" },
];

export const loader = async () => {
  const hello = await new Promise((resolve) => {
    setTimeout(() => resolve("hello"), 1000);
  });
  const animals: Promise<{ type: string; speak: string }[]> = new Promise(
    (resolve) => setTimeout(() => resolve(ANIMALS), 2000)
  );
  return defer({ animals, hello });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <p>{data.hello}</p>
      <Suspense fallback={<p>Loading...</p>}>
        <Await resolve={data.animals}>
          {(animals) => {
            return animals.map((animal) => (
              <button key={animal.type}>{animal.type}</button>
            ));
          }}
        </Await>
      </Suspense>
    </div>
  );
}
