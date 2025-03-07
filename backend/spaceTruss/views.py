# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from .models import Node
# from .serializers import NodeSerializer

# class NodeListCreateView(APIView):
#     def get(self, request):
#         nodes = Node.objects.all()
#         serializer = NodeSerializer(nodes, many=True)
#         return Response(serializer.data)

#     def post(self, request):
#         serializer = NodeSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)









from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Node
from .serializers import NodeSerializer

class NodeListCreateView(APIView):
    def get(self, request):
        nodes = Node.objects.all()
        serializer = NodeSerializer(nodes, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = NodeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class NodeDetailView(APIView):
    def delete(self, request, pk):
        node = get_object_or_404(Node, pk=pk)
        node.delete()
        return Response({"message": "Node deleted"}, status=status.HTTP_204_NO_CONTENT)
