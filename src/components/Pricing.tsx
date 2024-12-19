import { Tabs, Tab } from "@nextui-org/tabs";
import { groupPlansByType } from "@/lib/utils";
import PricingCard from "./PricingCard";
import { Button } from "@nextui-org/button";

export type props = {
  name: string;
  description: string;
  durations: {
    type: string;
    price: string;
    discount?: string;
    mostValuable: boolean;
  }[];
  features: string[];
};

function Pricing({ data }: { data: props[] }) {
  const [uniquePlanTypes, plansGroupedByType] = groupPlansByType(data);

  return (
    <>
      <div
        id="pricing"
        className="relative  z-20 flex mx-auto max-w-xl flex-col text-center"
      >
        <h2 className="font-medium text-secondary-600">Pricing</h2>
        <h1 className="text-3xl font-medium tracking-tight lg:text-5xl">
          Get lifetime access.
        </h1>
        <h2 className="mt-2 text-medium text-default-500 lg:mt-4 lg:text-large">
          Get lifetime access to 150+ components and a guarantee of 100 more to
          come, all for a one-time payment.
        </h2>
      </div>
            {/* @ts-ignore */}

      <Tabs aria-label="Pricing plans" classNames={{ tabList: "mx-auto my-3" }}>
        {uniquePlanTypes.map((type) => (
          <Tab key={type} title={type.charAt(0).toUpperCase() + type.slice(1)}>
            {type === "Custom" ? (
              <div className="relative overflow-hidden">
                <div className="text-center mx-auto w-[60%] blob-bg ">
                  {plansGroupedByType[type].map((plan, index) => (
                    <div key={index}>
                      <p className="text-3xl font-bold">{plan.description}</p>
                      <div className="relative flex w-full p-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased gap-4">
                        <ul className="flex flex-col justify-center text-start items-start gap-2 w-fit mx-auto">
                          {plan.features.map((e, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                aria-hidden="true"
                                role="img"
                                className="text-foreground-700"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="none"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="m6 12l4.243 4.243 8.484-8.486"
                                />
                              </svg>
                              <p className="text-default-500">{e}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button variant="bordered"
                                as="a"
                                href="https://api.whatsapp.com/send?phone=919313192028&text=Hi"
                                className="text-center mx-auto"
                      target="_self"
                      >
                        Contact Us{" "}
                        <span className="sr-only">
                          Get in touch for one time pricing plan
                        </span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {plansGroupedByType[type].map((plan, index) => (
                  <PricingCard
                    key={index}
                    name={plan.name}
                    pricing={
                      plan.durations.find((duration) => duration.type === type)
                        ?.price ?? "N/A"
                    }
                    discount={
                      plan.durations.find((duration) => duration.type === type)
                        ?.discount ?? "N/A"
                    }
                    description={plan.description}
                    features={plan.features}
                    isMostPopular={
                      plan.durations.find((duration) => duration.type === type)
                        ?.mostValuable ?? false
                    }
                  />
                ))}
              </div>
            )}
          </Tab>
        ))}
      </Tabs>
    </>
  );
}

export default Pricing;
