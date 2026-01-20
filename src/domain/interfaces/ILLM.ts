interface ILLM {
  profile(props: { role: string; content: string }): Promise<void>;
  send(text: string): Promise<string>;
}

export default ILLM;
