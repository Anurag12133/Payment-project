"use server";
import { getServerSession } from "next-auth";
import { SendCard } from "../../../components/card-stack";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import P2PTransaction from "../../../components/p2pTransactions";
import { OnRampTransactions } from "../../../components/OnRampTransactions";
async function getMoney() {
  const session = await getServerSession(authOptions);
  const txns = await prisma.onRampTransaction.findMany({
    where: {
      userId: Number(session?.user?.id),
    },
  });
  return txns.map((t) => ({
    time: t.startTime,
    amount: t.amount,
    status: t.status,
    provider: t.provider,
  }));
}
async function getp2pTransaction() {
  const session = await getServerSession(authOptions);
  const txns = await prisma.p2pTransfer.findMany({
    where: {
      fromUserId: Number(session?.user?.id),
    },
  });
  return txns.map((t) => ({
    time: t.timestamp,
    amount: t.amount,
    toUserId: t.toUserId,
  }));
}
export default async function () {
  const transactions = await getp2pTransaction();
  const balance = await getMoney();
  return (
    <div className="w-screen">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        Transactions
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <div>
          <P2PTransaction transactions={transactions} />
          <OnRampTransactions transactions={balance} />
        </div>
      </div>
    </div>
  );
}
