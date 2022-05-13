import { graphql } from '@octokit/graphql';
import { format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { toBase64 } from '../utils';
import { storage } from './storage';

const getMemlogStorageFileName = (time = new Date()) => {
  // ファイルを一覧表示しやすいようにフォルダの階層は1つとする
  return format(time, `yyyyMM/${time.getTime()}`);
};

const getAuthorizationHeader = () => {
  const token = storage.loadAccessToken();

  return { authorization: `Bearer ${token}` };
};

const queryUserProfile = async (params: { headers: Record<string, string> }): Promise<{ data: { viewer: { login: string; name: string; avatarUrl: string } } }> => {
  return graphql(
    `
      query {
        viewer {
          login
          name
          avatarUrl
        }
      }
    `,
    params,
  );
};

const queryLastCommitOid = async (params: {
  headers: Record<string, string>;
  owner: string;
  name: string;
}): Promise<{ repository: { defaultBranchRef: { name: string; target: { oid: string } } } }> => {
  return graphql(
    `
      query GetLastCommitOid($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          defaultBranchRef {
            name
            target {
              ... on Commit {
                oid
              }
            }
          }
        }
      }
    `,
    params,
  );
};

type CreateCommitOnBranchInput = {
  branch: { repositoryNameWithOwner: string; branchName: string };
  message: { headline: string };
  fileChanges: { additions: [{ path: string; contents: string }] };
  expectedHeadOid: string;
};
const mutateCreateCommitOnBranch = async (params: { headers: Record<string, string>; input: CreateCommitOnBranchInput }) => {
  return graphql(
    `
      mutation CreateCommit($input: CreateCommitOnBranchInput!) {
        createCommitOnBranch(input: $input) {
          commit {
            url
          }
        }
      }
    `,
    params,
  );
};

export const useUserProfileQuery = () => {
  const [result, setResult] = useState<{ loading: boolean; data: any; error: unknown }>({ loading: true, data: undefined, error: undefined });

  useEffect(() => {
    queryUserProfile({ headers: getAuthorizationHeader() })
      .then((data) => setResult({ loading: false, data, error: undefined }))
      .catch((error) => setResult({ loading: false, data: undefined, error }));
  }, []);

  return result;
};

export const useCreateCommitMutation = () => {
  const [result, setResult] = useState<{ loading: boolean; data: any; error: unknown }>({ loading: false, data: undefined, error: undefined });
  const execute = useCallback(
    async ({ owner, repositoryName, contents }: { owner: string; repositoryName: string; contents: string }) => {
      const headers = getAuthorizationHeader();
      setResult({ loading: true, data: undefined, error: undefined });
      const { repository } = await queryLastCommitOid({ headers, owner: owner, name: repositoryName });
      await mutateCreateCommitOnBranch({
        headers,
        input: {
          branch: { repositoryNameWithOwner: `${owner}/${repositoryName}`, branchName: repository.defaultBranchRef.name },
          expectedHeadOid: repository.defaultBranchRef.target.oid,
          message: { headline: 'update by memlog' },
          fileChanges: { additions: [{ path: getMemlogStorageFileName(), contents: toBase64(contents) }] },
        },
      })
        .then((data) => setResult({ loading: false, data, error: undefined }))
        .catch((error) => setResult({ loading: false, data: undefined, error }));
    },
    [setResult],
  );

  return [execute, result] as const;
};
