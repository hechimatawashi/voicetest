export async function synthesizeVoiceVox(
  message: string
)  {
    // URLをローカルストレージから取得
    const apiBaseUrl = 'https://9a31-2409-13-8981-1700-dd41-94e4-c7c7-bd55.ngrok-free.app';

    if (!apiBaseUrl) {
        throw new Error("API Base URL not configured");
    }

    // 1つ目のPOSTリクエスト
    const queryURL = new URL(`${apiBaseUrl}/audio_query`);
    queryURL.searchParams.append('text', message);
    queryURL.searchParams.append('speaker', '10');

    const queryParam = {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
    };
  
    const queryRes = await fetch(queryURL.toString(), queryParam);
  
    const queryData = (await queryRes.json()) as any;
  
    // 2つ目のPOSTリクエスト
    const synthesisURL = new URL(`${apiBaseUrl}/synthesis`);
    synthesisURL.searchParams.append('text', message);
    synthesisURL.searchParams.append('speaker', '10');
    synthesisURL.searchParams.append('outputSamplingRate', '24000');
  
    const synthesisParam = {
      method: "POST",
      body: JSON.stringify(queryData),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };
  
    const synthesisRes = await fetch(synthesisURL.toString(), synthesisParam);

    // レスポンスをArrayBufferとして取得
    const arrayBuffer = await synthesisRes.arrayBuffer();

    // ArrayBufferをbase64エンコード
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');

    // base64エンコードされたオーディオデータを含むオブジェクトを作成
    const data = {
      audio: `data:audio/x-wav;base64,${base64Audio}`,
      phonemes: [],
      seed: null,  // ここではseedをnullとしていますが、必要に応じて適切な値を設定してください
    };

    console.log(data)
    
    return { audio: data.audio };
  }
  