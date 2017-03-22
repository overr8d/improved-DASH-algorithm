# Improving Performance of DASH Algorithm with Divergent Buffer and Bandwidth Estimation Approaches
Video distribution platforms use adaptive video streaming to deliver the maximum Quality of Experience to a wide range of devices connected to the Internet through different access networks. Among the techniques employed to implement video adaptivity, the stream-switching over HTTP is getting a wide acceptance due to its deployment and implementation simplicity. In a typical DASH environment, namely the DASH server, supports adaptive streaming by hosting multiple representations of the video and each representation is divided into small segments of equal playback duration. At the client end, the video player uses an adaptive bitrate selection algorithm to decide the bitrate to be selected for each segment depending on the current network conditions. However, as a matter of the fact, segment sizes significantly vary among given video representations. Although adaptation algorithms are able to measure the network bandwidth, they may fall short in estimating the time to download the next segment. In this work, what has been already proposed by the DASH algorithm, is improved with regards to buffer and bandwidth estimation.
## Enhanced MPD
A typical MPD file contains information such as: media representation, segment duration, and segment URLs. We propose to enhance the MPD file by listing the sizes of the segments that are later used by the client to make an informed decision in the rate adaptation phase. In this experiment, the segment sizes are added to the standard MPD file before setting up the DASH server by running the JAVA application [here](https://github.com/overr8d/htmlParser). These sizes are later used in the throughput estimation and the algorithm.
## Buffer Implementation
The algorithm selects the most suitable representation for the next segment to be downloaded from the set of available representations. Every segment that is downloaded is placed in a buffer of maximum size B-max. The buffer is associated with three thresholds: I, B-alfa, B-beta as shown below. These thresholds are defined in terms of the number of segments. 
* I=2s, 
* B-alfa= 6s, 
* B-beta= 12s,
* B-max=16s.

<img width="333" alt="screen shot 2017-03-22 at 11 16 14" src="https://cloud.githubusercontent.com/assets/18366839/24188342/aa28c2c0-0ee9-11e7-9c22-ce654bb5e68a.png">

## Server Implementation
Rather than having the server store each video segment as well as the mpd file, a different approached is followed in this experiment. A static server is implemented in NodeJS and it simply serves the modified MPD file to the client at localhost:3000/. Once the MPD file is returned to the client, the URLs attached to each different video segment are exposed and used to start downloading. 
## Adaptive Algorithm
Once the client sends a request to the designated server, onload function is fired up and XML file is converted to JSON objects before initiating the segment download. Based on the buffer occupancy at any given time, B-curr, the rate adaptation is done in four stages listed as follows:
* (B-curr <= I): When the buffer occupancy is below I, the lowest bitrate is selected. This ensures that the playback start time is kept as small as possible. It was observed that minimizing playback start time is important to prevent the user from abandoning the video session.
* (I < B-curr <= B-alfa): Once the buffer occupancy goes beyond I, the algorithm starts measuring the network bandwidth and calculates cumulative bandwidth estimation value.Next segment's file sizes in each representation are taken into consideration and compared to estimated value, then picked the highest possible and downloaded without changing the current representation. The formula utilized during cumulative calculation is as follows:

> current_bandwidth = (current_bandwidth x 0.875) +(estimated_bandwidth x 0.125)

* (B-alfa < B-curr <= B-beta): The region between B-alfa and B-beta is the most preferred buffer occupancy. In this stage, based on the current network bandwidth and the buffer occupancy, the most suitable bitrate that is greater than or equal to  1.2x of the current bitrate is selected. The parameter "1.2" is defined based on emprical experiment results conducted before. This ensures an aggressive and steady increase in the video quality.
* (B-beta < B-curr <= B-max): When the buffer occupancy increases beyond B-beta, the most suitable bitrate for the current network bandwidth is selected; however, the request for the segment is sent only when the buffer occupancy falls to B-beta. The delayed download limits the total number of segments in the video buffer, thus avoiding unnecessary downloads in case the user prematurely quits watching the video.

## Test Results
The results are shown below for 4Mbps and 6Mbps respectively. In both cases, devised algorithm performs better in terms of smoother video streaming, higher quality of representation and less bitrate variation. Usually, the users are more critical towards downward switches and less affected by upward switching, which indicates that the increase in the number of upward switches to avoid subsequent downward switches can lead to a better QoE. It is obvious that the solution explained here serves this purpose more than DASH algorithm and provides better QoE.


<img width="500" alt="screen shot 2017-03-22 at 12 42 27" src="https://cloud.githubusercontent.com/assets/18366839/24191677/2875535e-0ef5-11e7-8d92-a1d1e32a56c7.png">

<img width="500" alt="screen shot 2017-03-22 at 12 42 18" src="https://cloud.githubusercontent.com/assets/18366839/24191736/4be72164-0ef5-11e7-95f3-e169d61fa734.png">

