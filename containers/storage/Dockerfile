FROM rustfs/rustfs:latest

# The base image declares `/data` as a VOLUME, and some builders discard the changes under VOLUME directories on build.
# Store the data in another directory so that the bucket created on build is kept in the image.
# When a new named volume is mounted to this directory, the container engine copies the bucket into the volume.
ENV RUSTFS_VOLUMES=/guildkit-data

USER root
RUN mkdir /guildkit-data && chown rustfs:rustfs /guildkit-data

USER rustfs
COPY create-bucket.sh /create-bucket.sh
RUN sh /create-bucket.sh
