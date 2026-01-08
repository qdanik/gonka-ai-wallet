import type { Event, StdFee } from "@cosmjs/stargate";
import type {
  QueryDepositResponse,
  QueryDepositsResponse,
  QueryParamsResponse,
  QueryProposalResponse,
  QueryProposalsResponse,
  QueryTallyResultResponse,
  QueryVoteResponse,
  QueryVotesResponse,
} from "cosmjs-types/cosmos/gov/v1beta1/query";
import type { GonkaSDKResults } from "./base.types";

export { VoteOption } from "cosmjs-types/cosmos/gov/v1beta1/gov";

export type GovernanceVoteOptions = {
  memo?: string;
  gasPrice?: string;
  fee?: StdFee | "auto" | number;
};

export type GovernanceVoteInfo = GonkaSDKResults<QueryVoteResponse["vote"]>;

export type GovernanceVotes = GonkaSDKResults<QueryVotesResponse>;

export type GovernanceTally = GonkaSDKResults<QueryTallyResultResponse["tally"]>;

export type GovernanceDeposit = GonkaSDKResults<QueryDepositResponse["deposit"]>;

export type GovernanceDeposits = GonkaSDKResults<QueryDepositsResponse>;

export type GovernanceProposal = GonkaSDKResults<QueryProposalResponse["proposal"]>;

export type GovernanceProposals = GonkaSDKResults<QueryProposalsResponse>;

export type GovernanceParams = GonkaSDKResults<QueryParamsResponse>;

export type GovernanceEvent = Event;

export type GovernanceVoteSuccess = {
  code: number;
  hash: string;
  height: number;
  gasUsed: bigint;
  gasWanted: bigint;
  events: readonly GovernanceEvent[];
};

export type GovernanceVote = GonkaSDKResults<GovernanceVoteSuccess>;
