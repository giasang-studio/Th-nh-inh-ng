// Fix: Create the geminiService module to provide AI functionalities.
import { GoogleGenAI, Modality } from "@google/genai";

// Fix: Initialize the GoogleGenAI client. The API key is expected to be in environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Fix: Add a helper function to convert data URL to a Gemini Part object.
const dataUrlToPart = (dataUrl: string) => {
    const [header, base64Data] = dataUrl.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1];
    if (!mimeType || !base64Data) {
        throw new Error("Invalid data URL");
    }
    return {
        inlineData: {
            data: base64Data,
            mimeType,
        },
    };
};

// Fix: Implement getAiSuggestions to provide editing ideas.
export const getAiSuggestions = async (image: string): Promise<string[]> => {
    const imagePart = dataUrlToPart(image);
    const prompt = "Phân tích hình ảnh này và đề xuất 5 ý tưởng chỉnh sửa ngắn gọn và sáng tạo mà người dùng có thể thử. Trả về các ý tưởng dưới dạng một mảng JSON chứa các chuỗi. Ví dụ: [\"thay nền thành thành phố tương lai\", \"thêm một con kỳ lân\"]";

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
          responseMimeType: "application/json",
        }
    });

    try {
        const jsonText = response.text.trim().replace(/```json|```/g, '');
        const suggestions = JSON.parse(jsonText);
        return Array.isArray(suggestions) ? suggestions.slice(0, 5) : Promise.reject("AI response is not an array.");
    } catch (e) {
        console.error("Failed to parse AI suggestions:", e);
        throw new Error("Could not get suggestions from AI.");
    }
};

// Fix: Implement performAiEdit for generative image editing using the image-preview model.
export const performAiEdit = async (image: string, prompt: string, mask: string | null): Promise<string> => {
    const imagePart = dataUrlToPart(image);
    const textPart = { text: prompt };
    const parts = [imagePart, textPart];
    
    if (mask) {
        // Add the mask part for regional editing
        const maskPart = dataUrlToPart(mask);
        parts.push(maskPart);
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes = part.inlineData.data;
            const mimeType = part.inlineData.mimeType;
            return `data:${mimeType};base64,${base64ImageBytes}`;
        }
    }

    throw new Error("AI did not return an edited image.");
};

// Fix: Implement combineImages to blend two images based on a prompt.
export const combineImages = async (image1: string, image2: string, prompt: string): Promise<string> => {
    const imagePart1 = dataUrlToPart(image1);
    const imagePart2 = dataUrlToPart(image2);
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts: [imagePart1, imagePart2, textPart] },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        }
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }
    
    throw new Error("AI did not return a combined image.");
};

// Fix: Implement createMarketingImage for generating ad-style visuals.
export const createMarketingImage = async (characterImage: string, productImage: string, style: string, prompt: string): Promise<string> => {
    const charPart = dataUrlToPart(characterImage);
    const prodPart = dataUrlToPart(productImage);
    const fullPrompt = `Tạo một hình ảnh marketing theo phong cách ${style}. Hình ảnh cần có nhân vật và sản phẩm được cung cấp. Định hướng sáng tạo của người dùng: "${prompt}". Hãy kết hợp chúng một cách liền mạch.`;
    const textPart = { text: fullPrompt };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts: [charPart, prodPart, textPart] },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        }
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
             return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }
    
    throw new Error("AI did not return a marketing image.");
};

// Fix: Implement generateVideo to create a short video from an image and prompt.
export const generateVideo = async (image: string, prompt: string): Promise<string> => {
    const [header, base64Data] = image.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1];
    if (!mimeType || !base64Data) {
        throw new Error("Invalid image data URL");
    }

    let operation = await ai.models.generateVideos({
        model: 'veo-2.0-generate-001',
        prompt: prompt,
        image: {
            imageBytes: base64Data,
            mimeType: mimeType,
        },
        config: { numberOfVideos: 1 }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation failed to return a download link.");
    }
    
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!response.ok) {
        throw new Error(`Failed to download video: ${response.statusText}`);
    }
    const videoBlob = await response.blob();
    return URL.createObjectURL(videoBlob);
};

// Fix: Implement restorePhoto to fix old or damaged photos.
export const restorePhoto = (image: string, options: { fixScratches: boolean; colorize: boolean; enhanceFaces: boolean; }): Promise<string> => {
    let prompt = "Phục hồi bức ảnh cũ này.";
    if (options.fixScratches) prompt += " Sửa các vết xước, rách và các hư hỏng khác.";
    if (options.colorize) prompt += " Tô màu cho ảnh nếu nó là ảnh đen trắng.";
    if (options.enhanceFaces) prompt += " Nâng cao độ rõ nét và chi tiết của bất kỳ khuôn mặt nào.";

    return performAiEdit(image, prompt, null);
};

// Fix: Implement enhanceQuality to upscale and improve image details.
export const enhanceQuality = (image: string): Promise<string> => {
    const prompt = "Nâng cao chất lượng tổng thể của hình ảnh này. Cải thiện độ sắc nét, độ rõ nét, độ phân giải và sửa bất kỳ lỗi nén nào. Làm cho nó trông chuyên nghiệp và có độ phân giải cao.";
    return performAiEdit(image, prompt, null);
};

// Fix: Implement extractTextFromImage using Gemini for OCR.
export const extractTextFromImage = async (image: string): Promise<string> => {
    const imagePart = dataUrlToPart(image);
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                imagePart,
                { text: "Thực hiện OCR trên hình ảnh này và trích xuất tất cả văn bản. Nếu không có văn bản, hãy trả về một chuỗi rỗng." }
            ]
        }
    });
    return response.text;
};

// Fix: Implement expandImage (outpainting) by manipulating canvas and using a mask.
export const expandImage = async (
    image: string, 
    config: { direction: 'top' | 'bottom' | 'left' | 'right', percentage: number }, 
    prompt: string
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = image;
        img.onload = async () => {
            try {
                const { naturalWidth: originalWidth, naturalHeight: originalHeight } = img;
                let newWidth = originalWidth;
                let newHeight = originalHeight;
                let offsetX = 0;
                let offsetY = 0;

                const expandWidth = originalWidth * (config.percentage / 100);
                const expandHeight = originalHeight * (config.percentage / 100);

                switch (config.direction) {
                    case 'top': newHeight += expandHeight; offsetY = expandHeight; break;
                    case 'bottom': newHeight += expandHeight; break;
                    case 'left': newWidth += expandWidth; offsetX = expandWidth; break;
                    case 'right': newWidth += expandWidth; break;
                }

                // Create a new canvas with expanded dimensions and draw the original image on it
                const canvas = document.createElement('canvas');
                canvas.width = newWidth;
                canvas.height = newHeight;
                const ctx = canvas.getContext('2d');
                if (!ctx) throw new Error("Could not get canvas context");
                ctx.drawImage(img, offsetX, offsetY);
                const expandedImageWithBlank = canvas.toDataURL('image/png');

                // Create a mask where white indicates the area to be filled by AI
                const maskCanvas = document.createElement('canvas');
                maskCanvas.width = newWidth;
                maskCanvas.height = newHeight;
                const maskCtx = maskCanvas.getContext('2d');
                if (!maskCtx) throw new Error("Could not get mask canvas context");
                maskCtx.fillStyle = 'white';
                maskCtx.fillRect(0, 0, newWidth, newHeight);
                maskCtx.clearRect(offsetX, offsetY, originalWidth, originalHeight);
                const maskImage = maskCanvas.toDataURL('image/png');
                
                const fullPrompt = `Mở rộng hình ảnh một cách liền mạch để lấp đầy vùng được che (màu trắng). Định hướng sáng tạo: ${prompt || 'tiếp tục hình ảnh hiện có một cách tự nhiên'}.`;

                const result = await performAiEdit(expandedImageWithBlank, fullPrompt, maskImage);
                resolve(result);
            } catch(e) {
                reject(e);
            }
        };
        img.onerror = () => reject(new Error("Failed to load image for expansion."));
    });
};

export const getMarketingSuggestions = async (characterImage: string, productImage: string): Promise<string[]> => {
    const charPart = dataUrlToPart(characterImage);
    const prodPart = dataUrlToPart(productImage);
    const prompt = "Phân tích hình ảnh nhân vật và sản phẩm này. Đề xuất 5 ý tưởng quảng cáo ngắn gọn, sáng tạo kết hợp cả hai. Trả về dưới dạng một mảng JSON các chuỗi. Ví dụ: [\"nhân vật đang thư giãn trên bãi biển với sản phẩm bên cạnh\", \"sản phẩm được làm nổi bật trên nền trừu tượng với nhân vật ở hậu cảnh\"]";

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [charPart, prodPart, { text: prompt }] },
        config: {
            responseMimeType: "application/json",
        }
    });
    
    try {
        const jsonText = response.text.trim().replace(/```json|```/g, '');
        const suggestions = JSON.parse(jsonText);
        return Array.isArray(suggestions) ? suggestions.slice(0, 5) : Promise.reject("Phản hồi của AI không phải là một mảng.");
    } catch (e) {
        console.error("Không thể phân tích gợi ý từ AI:", e);
        throw new Error("Không thể nhận được gợi ý từ AI.");
    }
};