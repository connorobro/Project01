import { searchJobs } from "../src/utils/adzuna";

declare const global: any;

beforeEach(() => {
  jest.resetAllMocks();
});

test("searchJobs returns parsed results", async () => {
  const payload = {
    results: [
      {
        id: 123,
        title: "Dev",
        company: { display_name: "Acme" },
        location: { display_name: "NYC" },
        created: "2025-01-01",
        redirect_url: "http://x",
      },
      {
        id: 456,
        title: "QA",
        company: { display_name: "Beta" },
        location: { display_name: "SF" },
        created: "2025-02-02",
        redirect_url: "http://y",
      },
    ],
  };

  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => payload,
  });

  const data = await searchJobs("software", 1);
  expect(Array.isArray(data)).toBe(true);
  expect(data).toHaveLength(2);
  // spot-check a field that should round-trip
  expect(String(data[0].id)).toBe("123");
});

test("searchJobs throws if fetch fails", async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status: 500,
    json: async () => ({ error: "boom" }),
  });

  await expect(searchJobs("software", 1)).rejects.toBeTruthy();
});
