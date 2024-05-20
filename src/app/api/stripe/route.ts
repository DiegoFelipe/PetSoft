import prisma from "@/lib/db";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  // verify webhook came from stripe
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return Response.json(null, { status: 400 });
  }

  // fullfill order
  switch (event.type) {
    case "checkout.session.completed":
      await prisma.user.update({
        where: { email: event.data.object.customer_email },
        data: { hasAccess: true },
      });
      break;
    default:
      console.log("unhandled event type");
  }

  // return 200 ok
  return Response.json(null, { status: 200 });
}
