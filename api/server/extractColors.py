import numpy as np
import cv2

class ExtractColors:
    def __init__(self,filepath):
        self.image=cv2.imread(filepath)
        self.p_image=None
        self.colorList=[]
        self.filename=filepath.split('/')[1]
    
    def preProcess(self):
        
        image=self.image
        img=image[50:990,140:180]
        height, width, _ = np.shape(img)
        for i in range(height):
            mean=np.average(img[i],axis=0)
            img[i]=np.array([mean]*width)
        dims=(width*2,height)
        img=cv2.resize(img,dims,interpolation=cv2.INTER_CUBIC)
        self.p_image=img


    @staticmethod
    def display(image):
        cv2.imshow("Image",image)
        cv2.waitKey(0)
        cv2.destroyAllWindows()

    @staticmethod
    def save(img,path):
        cv2.imwrite(path,img)

    def read_colors(self):
        def create_bar(height, width, color):
            bar = np.zeros((height, width, 3), np.uint8)
            bar[:] = color
            red, green, blue = int(color[2]), int(color[1]), int(color[0])
            return bar, (red, green, blue)

    
        height, width, _ = np.shape(self.p_image)
        img=self.p_image
        # print(height, width)
        centers=[]
        xpos=width//2
        ypos=20
        y_offset=90
        for i in range(10):
            segment=img[ypos-2:ypos,xpos-1:xpos+1]
            avg_color=[]
            for row in segment:
                avg_color_row=np.average(row,axis=0)
                avg_color.append(avg_color_row)
            avg_color=np.array(avg_color)
            avg_col=np.average(avg_color,axis=0)
            centers.append(avg_col)
            ypos+=y_offset
    
        bars = []
        rgb_values = []

        for index, row in enumerate(centers):
            bar, rgb = create_bar(200,100,row)
            sep,_ =create_bar(200,5,[0,0,0])
            bars.append(bar)
            bars.append(sep)
            rgb_values.append(rgb)

        img_bar = np.hstack(bars)
        return rgb_values,img_bar