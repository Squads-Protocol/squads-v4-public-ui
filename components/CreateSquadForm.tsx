"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Member, createMultisig } from "@/lib/createSquad";
import { Connection, Keypair, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { PlusCircleIcon, XIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface MemberAddresses {
  count: number;
  memberData: Member[];
}

interface CreateSquadFormData {
  members: MemberAddresses;
  threshold: number;
  rentCollector: string;
  configAuthority: string;
  createKey: string;
}

export default function CreateSquadForm({ rpc }: { rpc: string }) {
  const router = useRouter();
  const wallet = useWallet();

  const connection = new Connection(rpc || clusterApiUrl("mainnet-beta"));

  if (!wallet) return null;

  const [form, setForm] = useState<CreateSquadFormData>({
    threshold: 1,
    rentCollector: "",
    configAuthority: "",
    createKey: "",
    members: {
      count: 0,
      memberData: [],
    },
  });

  const handleAddAddress = (e: any) => {
    e.preventDefault();
    setForm((prev) => {
      return {
        ...prev,
        members: {
          count: prev.members.count + 1,
          memberData: [
            ...prev.members.memberData,
            {
              key: null,
              permissions: {
                mask: 0,
              },
            },
          ],
        },
      };
    });
  };

  const validate = () => {
    if (form.threshold < 1) {
      toast.error("Threshold must be greater than 0.");
      return false;
    }
    if (form.members.count < 1) {
      toast.error("At least one member is required.");
      return false;
    }

    return true;
  };

  async function handleCreate() {
    if (!wallet.publicKey) {
      return toast.error("Please connect your wallet.");
    }

    if (!validate()) return;

    const createKey = Keypair.generate();

    let configAuthority;
    if (isValidPublicKey(form.configAuthority)) {
      configAuthority = new PublicKey(form.configAuthority);
    }

    let rentCollector;
    if (isValidPublicKey(form.rentCollector)) {
      rentCollector = new PublicKey(form.rentCollector);
    }

    const { transaction, multisig } = await createMultisig(
      connection,
      wallet.publicKey,
      form.members.memberData,
      form.threshold,
      createKey.publicKey,
      rentCollector,
      configAuthority
    );

    const signature = await wallet.sendTransaction(transaction, connection, {
      skipPreflight: true,
      signers: [createKey],
    });
    console.log("Transaction signature", signature);
    toast.info("Transaction submitted.");
    await connection.confirmTransaction(signature, "confirmed");
    toast.success(`New Squad created: ${multisig.toBase58()}`);
    document.cookie = `x-multisig=${multisig.toBase58()}; path=/`;
    await new Promise((resolve) => setTimeout(resolve, 10000));
    router.refresh();
  }

  useEffect(() => {
    if (wallet.publicKey) {
      setForm((prev) => ({
        ...prev,
        members: {
          count: 1,
          memberData: [
            {
              key: wallet.publicKey as PublicKey,
              permissions: {
                mask: 7,
              },
            },
          ],
        },
      }));
    }
  }, [wallet]);

  return (
    <>
      <div className="grid grid-cols-8 gap-4 mb-6">
        <div className="col-span-6 flex-col space-y-2">
          <label htmlFor="members" className="font-medium">
            Members <span className="text-red-600">*</span>
          </label>
          {form.members.memberData.map((member, i) => (
            <div key={i} className="grid grid-cols-4 items-center gap-2">
              <div className="relative col-span-3">
                <Input
                  defaultValue={member.key ? member.key.toBase58() : ""}
                  placeholder={`Member key ${i + 1}`}
                  onChange={(e) => {
                    setForm((prev) => {
                      return {
                        ...prev,
                        members: {
                          ...prev.members,
                          memberData: prev.members.memberData.map(
                            (member, index) => {
                              if (index === i) {
                                return {
                                  ...member,
                                  key: new PublicKey(e.target.value),
                                };
                              }
                              return member;
                            }
                          ),
                        },
                      };
                    });
                  }}
                />
                {i > 0 && (
                  <XIcon
                    onClick={() => {
                      setForm((prev) => {
                        return {
                          ...prev,
                          members: {
                            ...prev.members,
                            memberData: prev.members.memberData.filter(
                              (_, index) => index !== i
                            ),
                          },
                        };
                      });
                    }}
                    className="absolute inset-y-3 right-2 w-4 h-4 text-zinc-400 hover:text-zinc-600"
                  />
                )}
              </div>
              <Select
                defaultValue={member.permissions.mask.toString()}
                onValueChange={(e) => {
                  setForm((prev) => {
                    return {
                      ...prev,
                      members: {
                        ...prev.members,
                        memberData: prev.members.memberData.map(
                          (member, index) => {
                            if (index === i) {
                              return {
                                ...member,
                                permissions: {
                                  mask: Number(e),
                                },
                              };
                            }
                            return member;
                          }
                        ),
                      },
                    };
                  });
                }}
              >
                <SelectTrigger className="col-span-1">
                  <SelectValue placeholder="Select permissions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="0">None</SelectItem>
                    <SelectItem value="1">Proposer</SelectItem>
                    <SelectItem value="2">Voter</SelectItem>
                    <SelectItem value="4">Executor</SelectItem>
                    <SelectItem value="7">All</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ))}
          <button
            onClick={(e) => handleAddAddress(e)}
            className="mt-2 flex gap-1 items-center text-zinc-400 hover:text-zinc-600"
          >
            <PlusCircleIcon className="w-4" />
            <p className="text-sm">Add Address</p>
          </button>
        </div>
        <div className="col-span-4 flex-col space-y-2">
          <label htmlFor="threshold" className="font-medium">
            Threshold <span className="text-red-600">*</span>
          </label>
          <Input
            type="number"
            placeholder="Approval threshold for execution"
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                threshold: Number(e.target.value),
              }))
            }
            className=""
          />
        </div>
        <div className="col-span-4 flex-col space-y-2">
          <label htmlFor="rentCollector" className="font-medium">
            Rent Collector
          </label>
          <Input
            type="text"
            placeholder="Optional rent collector"
            onChange={(e) =>
              setForm((prev) => ({ ...prev, rentCollector: e.target.value }))
            }
            className=""
          />
        </div>
        <div className="col-span-4 flex-col space-y-2">
          <label htmlFor="configAuthority" className="font-medium">
            Config Authority
          </label>
          <Input
            type="text"
            placeholder="Optional config authority"
            onChange={(e) =>
              setForm((prev) => ({ ...prev, configAuthority: e.target.value }))
            }
            className=""
          />
        </div>
      </div>
      <Button onClick={() => handleCreate()}>Create Squad</Button>
    </>
  );
}

const isValidPublicKey = (value: string) => {
  try {
    new PublicKey(value);
    return true;
  } catch (e) {
    return false;
  }
};
