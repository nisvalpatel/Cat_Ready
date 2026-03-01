const machineTypes = [
  "Excavator",
  "Dozer",
  "Loader",
  "Grader",
  "Compactor",
  "Truck",
  "Scraper",
  "Pipelayer",
];

const categories = [
  "Hydraulics",
  "Engine",
  "Undercarriage",
  "Electrical",
  "Cab",
  "Attachments",
  "Brakes",
  "Tires",
];

const models = [
  "D6",
  "320",
  "950",
  "140",
  "CS56",
  "777",
  "D8",
  "336",
  "966",
  "12M",
];

export function Marquee() {
  return (
    <section className="bg-white py-16 overflow-hidden">
      <div className="space-y-4">
        {/* Row 1: Machine Types - Yellow */}
        <div className="relative">
          <div className="flex animate-marquee">
            {[...machineTypes, ...machineTypes].map((item, index) => (
              <span
                key={`type-${index}`}
                className="inline-flex items-center px-6 py-3 mx-2 bg-cat-yellow text-cat-black font-bold rounded text-sm whitespace-nowrap"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Row 2: Categories - White/Gray */}
        <div className="relative">
          <div className="flex animate-marquee-reverse">
            {[...categories, ...categories].map((item, index) => (
              <span
                key={`cat-${index}`}
                className="inline-flex items-center px-6 py-3 mx-2 bg-cat-gray text-cat-black font-bold rounded text-sm whitespace-nowrap border border-cat-black/10"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Row 3: Models - Charcoal */}
        <div className="relative">
          <div className="flex animate-marquee">
            {[...models, ...models].map((item, index) => (
              <span
                key={`model-${index}`}
                className="inline-flex items-center px-6 py-3 mx-2 bg-cat-black text-cat-yellow font-bold rounded text-sm whitespace-nowrap"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
