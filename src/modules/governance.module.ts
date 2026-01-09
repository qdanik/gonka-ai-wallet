import type { OfflineSigner } from "@cosmjs/proto-signing";
import {
  calculateFee,
  type GovParamsType,
  type GovProposalId,
  QueryClient,
  setupGovExtension,
} from "@cosmjs/stargate";
import { Tendermint37Client } from "@cosmjs/tendermint-rpc";
import type { ProposalStatus } from "cosmjs-types/cosmos/gov/v1beta1/gov";
import { MsgVote } from "cosmjs-types/cosmos/gov/v1beta1/tx";
import { UnknownSignerError } from "@/lib/errors";
import type {
  GovernanceDeposit,
  GovernanceDeposits,
  GovernanceParams,
  GovernanceProposal,
  GovernanceProposals,
  GovernanceTally,
  GovernanceVote,
  GovernanceVoteInfo,
  GovernanceVoteOptions,
  GovernanceVotes,
  VoteOption,
} from "@/types";
import type { GonkaClient } from "./client.module";

export class GovernanceModule {
  constructor(private readonly client: GonkaClient) {}

  private async governanceClient() {
    const tendermint = await Tendermint37Client.connect(this.client.rpcUrl);
    const queryClient = new QueryClient(tendermint);
    return setupGovExtension(queryClient).gov;
  }

  async params(params: GovParamsType): Promise<GovernanceParams> {
    const governanceClient = await this.governanceClient();
    const response = await governanceClient.params(params);

    return { success: true, data: response };
  }

  async proposals(
    status: ProposalStatus,
    depositor: string,
    voter: string,
  ): Promise<GovernanceProposals> {
    const governanceClient = await this.governanceClient();
    const response = await governanceClient.proposals(status, depositor, voter);

    return { success: true, data: response };
  }

  async proposal(proposalId: string | number): Promise<GovernanceProposal> {
    const governanceClient = await this.governanceClient();
    const response = await governanceClient.proposal(proposalId);

    return { success: true, data: response.proposal };
  }

  async deposits(
    proposalId: GovProposalId,
    paginationKey?: Uint8Array,
  ): Promise<GovernanceDeposits> {
    const governanceClient = await this.governanceClient();
    const response = await governanceClient.deposits(proposalId, paginationKey);

    return { success: true, data: response };
  }

  async deposit(proposalId: GovProposalId, depositorAddress: string): Promise<GovernanceDeposit> {
    const governanceClient = await this.governanceClient();
    const response = await governanceClient.deposit(proposalId, depositorAddress);

    return { success: true, data: response.deposit };
  }

  async tally(proposalId: GovProposalId): Promise<GovernanceTally> {
    const governanceClient = await this.governanceClient();
    const response = await governanceClient.tally(proposalId);

    return { success: true, data: response.tally };
  }

  async votes(proposalId: GovProposalId, paginationKey?: Uint8Array): Promise<GovernanceVotes> {
    const governanceClient = await this.governanceClient();
    const response = await governanceClient.votes(proposalId, paginationKey);

    return {
      success: true,
      data: response,
    };
  }

  async voteInfo(proposalId: GovProposalId, voterAddress: string): Promise<GovernanceVoteInfo> {
    const governanceClient = await this.governanceClient();
    const response = await governanceClient.vote(proposalId, voterAddress);

    return {
      success: true,
      data: response.vote,
    };
  }

  async vote(
    signer: OfflineSigner,
    proposalId: number,
    option: VoteOption,
    options: GovernanceVoteOptions = {},
  ): Promise<GovernanceVote> {
    if (!signer) {
      throw new UnknownSignerError();
    }

    const { memo = "" } = options;
    const [account] = await signer.getAccounts();

    const gasPrice = await this.client.gasPrice(options?.gasPrice);
    const signingClient = await this.client.connectSigner(signer, gasPrice);

    const messageValue = MsgVote.fromPartial({
      voter: account.address,
      proposalId: BigInt(proposalId),
      option: option,
    });

    const messages = [
      {
        typeUrl: "/cosmos.gov.v1.MsgVote",
        value: messageValue,
      },
    ];

    const gasEstimation = await signingClient.simulate(account.address, messages, memo);
    const gasLimit = Math.ceil(gasEstimation * this.client.voteGasMultiplier);
    const fee = options?.fee ?? calculateFee(gasLimit, gasPrice);

    const response = await signingClient.signAndBroadcast(account.address, messages, fee, memo);

    return {
      success: true,
      data: {
        code: response.code ?? 0,
        hash: response.transactionHash,
        height: response.height,
        events: response.events,
        gasUsed: BigInt(response.gasUsed),
        gasWanted: BigInt(response.gasWanted),
      },
    };
  }
}
