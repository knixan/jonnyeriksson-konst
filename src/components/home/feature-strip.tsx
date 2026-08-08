import Image from "next/image";

const features = [
  { icon: "/icon/icon-map-nail.png", label: "Inspirerad av platser" },
  { icon: "/icon/icon-cup.png", label: "Föremål med karaktär" },
  { icon: "/icon/icon-cloude.png", label: "Fantasi utan gränser" },
  { icon: "/icon/icon-brush.png", label: "Självlärd konstnär" },
];

export function FeatureStrip() {
  return (
    <section className="bg-secondary">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-6 sm:grid-cols-4">
        {features.map((feature) => (
          <div
            key={feature.label}
            className="flex items-center gap-3 sm:flex-col sm:text-center"
          >
            <Image
              src={feature.icon}
              alt=""
              width={40}
              height={40}
              unoptimized
              className="size-10"
            />
            <p className="text-sm text-secondary-foreground">{feature.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
