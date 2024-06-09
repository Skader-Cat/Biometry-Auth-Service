from PIL import Image
from facenet_pytorch import MTCNN, InceptionResnetV1, extract_face
import numpy as np
import torch

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
mtcnn = MTCNN(device=device)
resnet = InceptionResnetV1(pretrained='vggface2').eval().to(device)

async def get_image_embedding(image: bytes) -> torch.Tensor:
    img = Image.open(image)
    
    faces, prob = mtcnn.detect(img)
    if faces is not None and prob[0] > 0.5:
        if faces.shape[0] > 1:
            print("Больше чем одно лицо на изображении")
            raise ValueError("Больше чем одно лицо на изображении")
        else:
            face_tensor = extract_face(img, faces[0])
            return resnet(face_tensor.unsqueeze(0)).detach().cpu().numpy()
    else:
        print("Лиц не обнаружено на изображении")
        raise ValueError("Лиц не обнаружено на изображении")
    
async def validate_image_embedding(embedding1: bytes, embedding2: bytes) -> bool:
    tensor_embedding1 = torch.frombuffer(embedding1, dtype=torch.float32)
    tensor_embedding2 = torch.frombuffer(embedding2, dtype=torch.float32)
    
    if len(tensor_embedding1) != len(tensor_embedding2):
        raise ValueError("Размерности векторов вложений должны быть одинаковыми.")
    
    similarity = torch.cosine_similarity(tensor_embedding1.view(1, -1), tensor_embedding2.view(1, -1))
    
    if similarity.item() > 0.9:  
        return True
    else:
        return False