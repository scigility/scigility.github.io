#!/bin/bash
cd $(dirname $0)

for i in `seq 4`;
do
  convert originals/Scigility_Slider_1800x400px_$i.jpg -resize 480x -strip -interlace Plane -define jpeg:extent=100kb slider$i-w480.jpg
  convert originals/Scigility_Slider_1800x400px_$i.jpg -resize 960x -strip -interlace Plane -define jpeg:extent=240kb slider$i-w960.jpg
  convert originals/Scigility_Slider_1800x400px_$i.jpg -resize 1440x -strip -interlace Plane -define jpeg:extent=400kb slider$i-w1440.jpg
  convert originals/Scigility_Slider_1800x400px_$i.jpg -resize 1920x -strip -interlace Plane -define jpeg:extent=500kb slider$i-w1920.jpg
done
