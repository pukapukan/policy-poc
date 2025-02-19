const BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://0.0.0.0:8000/'
const POLICY_API_URL = new URL('policies/', BASE_URL)

export type PolicyRequest = {
  name: string;
  body: [{
    type: "text",
    text: string
  }]
}

export class Policy {
  id: string;
  name: string;
  body: [{ type: "text"; text: string; }];
  version: number;
  created_at: Date;
  updated_at: Date;

  constructor(data: any) {
    this.id = data['id']
    this.name = data['name']
    this.body = data['body']
    this.version = data['version']
    this.created_at = new Date(data['created_at'])
    this.updated_at = new Date(data['updated_at'])
  }
  
}

export default class PolicyAPI {
  static async create(id: string, request: PolicyRequest) {
    const postUrl = new URL(id, POLICY_API_URL)
    console.log(postUrl)
    const response = await fetch(new URL(id, POLICY_API_URL), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    })
    if (!response.ok) {
      throw new Error(`PolicyAPI.list failed with status code: ${response.status}`)
    }
    const data = await response.json()
    return new Policy(data)
  }

  static async patch(id: string, request: PolicyRequest) {
    const postUrl = new URL(id, POLICY_API_URL)
    const response = await fetch(postUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    })
    if (!response.ok) {
      throw new Error(`PolicyAPI.patch(id: ${id}) failed with status code: ${response.status}`)
    }
    return new Policy(await response.json())
  }

  static async list() {
    const response = await fetch(POLICY_API_URL)
    if (!response.ok) {
      throw new Error(`PolicyAPI.list failed with status code: ${response.status}`)
    }
    return (await response.json() as any[]).map((data) => new Policy(data))
  }

  static async get(id: string, version?: number) {
    version = version || 1
    const response = await fetch(new URL(`${id}/${version}`, POLICY_API_URL))
    if (!response.ok) {
      throw new Error(`PolicyAPI.get(id: ${id}, version: ${version}) failed with status code: ${response.status}`)
    }
    return new Policy(await response.json())
  }

  static async delete(id: string) {
    const response = await fetch(new URL(id, POLICY_API_URL), {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error(`PolicyAPI.delete(id: ${id}) failed with status code: ${response.status}`)
    }
    return !!((await response.json())['success'])
  }

  static async getDiff(id: string, baselineVersion: number, candidateVersion: number) {
    const diffUrl = new URL(`${id}/diff`, POLICY_API_URL)
    diffUrl.searchParams.append('baseline_version', baselineVersion.toString())
    diffUrl.searchParams.append('candidate_version', candidateVersion.toString())

    const response = await fetch(diffUrl)
    if (!response.ok) {
      throw new Error(`PolicyAPI.getDiff(id: ${id}, baseline: ${baselineVersion}, candidate: ${candidateVersion}) failed with status code: ${response.status}`)
    }

    const data = await response.json()
    return data.diff as string
  }
}