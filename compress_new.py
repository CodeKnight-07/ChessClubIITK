import os
from PIL import Image, ImageOps

def compress_image(file_path, max_dim=1000, quality=75):
    if not os.path.exists(file_path):
        print(f"Skipping (does not exist): {file_path}")
        return
    try:
        orig_size = os.path.getsize(file_path)
        
        with Image.open(file_path) as img:
            # Transpose based on EXIF to prevent auto-rotation
            img = ImageOps.exif_transpose(img)
            
            orig_width, orig_height = img.size
            img_format = img.format
            
            # Proportionally resize
            if orig_width > max_dim or orig_height > max_dim:
                if orig_width > orig_height:
                    new_width = max_dim
                    new_height = int((max_dim / orig_width) * orig_height)
                else:
                    new_height = max_dim
                    new_width = int((max_dim / orig_height) * orig_width)
                
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
            # Convert to RGB for saving as JPEG
            if img.mode in ('RGBA', 'LA') and (img_format == 'JPEG' or file_path.lower().endswith(('.jpg', '.jpeg'))):
                img = img.convert('RGB')
                
            # Save back in place
            if img_format == 'JPEG' or file_path.lower().endswith(('.jpg', '.jpeg')):
                img.save(file_path, format='JPEG', quality=quality, optimize=True)
            elif img_format == 'PNG' or file_path.lower().endswith('.png'):
                img.save(file_path, format='PNG', optimize=True)
            elif img_format == 'WEBP' or file_path.lower().endswith('.webp'):
                img.save(file_path, format='WEBP', quality=quality)
                
        new_size = os.path.getsize(file_path)
        reduction = ((orig_size - new_size) / orig_size) * 100
        print(f"Compressed {file_path}:")
        print(f"  Size: {orig_size/1024:.1f}KB -> {new_size/1024:.1f}KB ({reduction:.1f}% reduction)")
    except Exception as e:
        print(f"Failed to compress {file_path}: {e}")

def main():
    target_dirs = [
        'react-app/src/Gallery',
        'backend/static/uploads/Gallery'
    ]
    valid_extensions = ('.png', '.jpg', '.jpeg', '.webp')
    
    print("Starting compression for gallery photos...")
    for target_dir in target_dirs:
        if not os.path.exists(target_dir):
            print(f"Directory not found: {target_dir}")
            continue
        for root, dirs, files in os.walk(target_dir):
            for file in files:
                if file.lower().endswith(valid_extensions):
                    file_path = os.path.join(root, file)
                    compress_image(file_path)
    print("Compression complete!")

if __name__ == '__main__':
    main()
